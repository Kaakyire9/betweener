import React, { useEffect, useState, useRef, useCallback } from "react";
import { supabaseBrowser } from "@/lib/supabaseClient";
import TypingIndicator from "./TypingIndicator";

type Message = {
	id: string;
	sender_id: string;
	receiver_id: string;
	content: string;
	created_at: string;
	read_at?: string | null;
	read?: boolean;
	attachment_url?: string | null;
	attachment_type?: string | null;
};

type ChatWindowProps = {
	currentUserId: string;
	otherUserId: string;
	otherUserName: string;
	otherUserAvatar?: string;
};

// Helper to upsert typing status
async function setTypingStatus(chatId: string, userId: string, isTyping: boolean) {
	await supabaseBrowser.from("typing_status").upsert([
		{
			chat_id: chatId,
			user_id: userId,
			is_typing: isTyping,
			updated_at: new Date().toISOString(),
		}
	], { onConflict: "chat_id,user_id" });
}

// Helper to upload file to Supabase Storage
async function uploadAttachment(file: File, userId: string): Promise<{ url: string, type: string } | null> {
	const filePath = `chat-attachments/${userId}/${Date.now()}-${file.name}`;
	const { error } = await supabaseBrowser.storage.from('attachments').upload(filePath, file);
	if (error) return null;
	const { data: publicUrl } = supabaseBrowser.storage.from('attachments').getPublicUrl(filePath);
	return publicUrl?.publicUrl ? { url: publicUrl.publicUrl, type: file.type } : null;
}

export default function ChatWindow({ currentUserId, otherUserId, otherUserName, otherUserAvatar }: ChatWindowProps) {
	const [messages, setMessages] = useState<Message[]>([]);
	const [input, setInput] = useState("");
	const [loading, setLoading] = useState(true);
	const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
	const [uploading, setUploading] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const chatId = `chat-${[currentUserId, otherUserId].sort().join('-')}`;

	// Fetch messages and mark as read (with read_at)
	useEffect(() => {
		async function fetchMessages() {
			setLoading(true);
			const { data, error } = await supabaseBrowser
				.from("messages")
				.select("*")
				.or(`and(sender_id.eq.${currentUserId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${currentUserId})`)
				.order("created_at", { ascending: true });
			if (!error && data) setMessages(data);
			setLoading(false);
		}
		fetchMessages();
		// Mark all messages from otherUserId to currentUserId as read and set read_at
		supabaseBrowser
			.from("messages")
			.update({ read: true, read_at: new Date().toISOString() })
			.eq("sender_id", otherUserId)
			.eq("receiver_id", currentUserId)
			.eq("read", false);
		// Subscribe to new messages
		const subscription = supabaseBrowser
			.channel('public:messages')
			.on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
				const msg = payload.new as Message;
				if (
					(msg.sender_id === currentUserId && msg.receiver_id === otherUserId) ||
					(msg.sender_id === otherUserId && msg.receiver_id === currentUserId)
				) {
					setMessages(prev => [...prev, msg]);
				}
			})
			.subscribe();
		return () => {
			supabaseBrowser.removeChannel(subscription);
		};
	}, [currentUserId, otherUserId]);

	// Scroll to bottom on new message
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	// Send message
	async function sendMessage(e: React.FormEvent) {
		e.preventDefault();
		if (!input.trim()) return;
		await supabaseBrowser.from("messages").insert({
			sender_id: currentUserId,
			receiver_id: otherUserId,
			content: input.trim(),
		});
		setInput("");
		// Set typing to false after sending
		setTypingStatus(chatId, currentUserId, false);
	}

	// Send attachment
	async function handleAttachment(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (!file) return;
		setUploading(true);
		const uploaded = await uploadAttachment(file, currentUserId);
		if (uploaded) {
			await supabaseBrowser.from("messages").insert({
				sender_id: currentUserId,
				receiver_id: otherUserId,
				content: "[Attachment]",
				attachment_url: uploaded.url,
				attachment_type: uploaded.type,
			});
		}
		setUploading(false);
		e.target.value = "";
	}

	// Handle typing
	const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		setInput(e.target.value);
		setTypingStatus(chatId, currentUserId, true);
		if (typingTimeout) clearTimeout(typingTimeout);
		const timeout = setTimeout(() => {
			setTypingStatus(chatId, currentUserId, false);
		}, 2000);
		setTypingTimeout(timeout);
	}, [chatId, currentUserId, typingTimeout]);

	return (
		<div className="flex flex-col h-full max-h-[80vh] border rounded-lg shadow bg-white">
			{/* Header */}
			<div className="flex items-center gap-3 p-4 border-b bg-gray-50">
				{otherUserAvatar ? (
					<img src={otherUserAvatar} alt={otherUserName} className="w-10 h-10 rounded-full object-cover" />
				) : (
					<div className="w-10 h-10 rounded-full bg-gray-200" />
				)}
				<div className="font-bold text-blue-700">{otherUserName}</div>
			</div>
			{/* Messages */}
			<div className="flex-1 overflow-y-auto p-4 space-y-2">
				{loading ? (
					<div className="text-center text-gray-400">Loading...</div>
				) : messages.length === 0 ? (
					<div className="text-center text-gray-400">No messages yet. Say hello!</div>
				) : (
					messages.map((msg, idx) => {
						const isMine = msg.sender_id === currentUserId;
						const isLastMine = isMine && idx === messages.length - 1;
						return (
							<div
								key={msg.id}
								className={`flex ${isMine ? "justify-end" : "justify-start"}`}
							>
								<div
									className={`px-4 py-2 rounded-2xl max-w-xs break-words shadow text-sm ${
										isMine
											? "bg-blue-600 text-white rounded-br-none"
											: "bg-gray-200 text-gray-800 rounded-bl-none"
									}`}
								>
									{/* Attachment rendering */}
									{msg.attachment_url ? (
										msg.attachment_type?.startsWith('image') ? (
											<img src={msg.attachment_url} alt="attachment" className="max-w-[200px] max-h-[200px] mb-1 rounded" />
										) : (
											<a href={msg.attachment_url} target="_blank" rel="noopener noreferrer" className="underline text-blue-200 block mb-1">Download file</a>
										)
									) : null}
									{msg.content}
									{/* Read receipt for last sent message */}
									{isLastMine && (
										<div className="flex items-center gap-1 text-[10px] text-right mt-1">
											{msg.read_at ? (
												<span className="text-green-500">✔ Seen</span>
											) : (
												<span className="text-gray-300">✔ Sent</span>
											)}
										</div>
									)}
									<div className="text-[10px] text-right text-gray-300 mt-1">
										{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
									</div>
								</div>
							</div>
						);
					})
				)}
				<div ref={messagesEndRef} />
			</div>
			{/* Typing indicator */}
			<TypingIndicator chatId={chatId} otherUserId={otherUserId} />
			{/* Input */}
			<form onSubmit={sendMessage} className="flex gap-2 p-4 border-t bg-gray-50">
				<label className="flex items-center cursor-pointer">
					<input
						type="file"
						accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/zip,application/x-rar-compressed,application/octet-stream"
						className="hidden"
						onChange={handleAttachment}
						disabled={uploading}
					/>
					<span className="text-xl px-2">📎</span>
				</label>
				<input
					type="text"
					className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
					placeholder={uploading ? "Uploading..." : "Type a message..."}
					value={input}
					onChange={handleInputChange}
					disabled={uploading}
				/>
				<button
					type="submit"
					className="bg-blue-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-blue-700 transition"
					disabled={uploading}
				>
					Send
				</button>
			</form>
		</div>
	);
}
