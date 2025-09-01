"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export default function Home() {
  const [message, setMessage] = useState("")
  const [chat, setChat] = useState<string[]>([])

  const handleSend = () => {
    if (!message.trim()) return
    setChat([...chat, message])
    setMessage("")
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
      <Card className="w-[350px] shadow-xl">
        <CardHeader className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src="https://i.pravatar.cc/150?img=47" alt="Profile" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>Jane Doe, 25</CardTitle>
            <p className="text-sm text-gray-500">Loves hiking and music 🎶</p>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Action Buttons */}
          <div className="flex justify-between">
            <Button variant="outline" className="w-[45%]">
              ❌ Pass
            </Button>

            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-[45%] bg-pink-500 hover:bg-pink-600">
                  ❤️ Like
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>It’s a Match! 🎉</DialogTitle>
                </DialogHeader>
                <p className="text-sm text-gray-600">
                  You and Jane liked each other.
                </p>
              </DialogContent>
            </Dialog>
          </div>

          {/* Simple Chat Demo */}
          <div className="border rounded-lg p-3 h-40 overflow-y-auto bg-white">
            {chat.map((msg, i) => (
              <p key={i} className="text-sm text-gray-800 mb-1">
                {msg}
              </p>
            ))}
          </div>

          <div className="flex space-x-2">
            <Input
              placeholder="Say hi..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button onClick={handleSend}>Send</Button>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
