import React from "react";
import { motion, useAnimation } from "framer-motion";

interface DiscoveryCardProps {
  name: string;
  age: number;
  avatarUrl?: string;
  bio: string;
  region: string;
  tribe: string;
  religion: string;
  onLike: () => void;
  onPass: () => void;
  enableSwipe?: boolean;
}

const DiscoveryCard: React.FC<DiscoveryCardProps> = ({
  name,
  age,
  avatarUrl,
  bio,
  region,
  tribe,
  religion,
  onLike,
  onPass,
  enableSwipe = false,
}) => {
  const controls = useAnimation();

  // Only enable swipe in Card View
  const handleDragEnd = (_: any, info: { offset: { x: number } }) => {
    if (!enableSwipe) return;
    if (info.offset.x > 120) {
      controls.start({ x: 500, opacity: 0 });
      setTimeout(onLike, 200);
    } else if (info.offset.x < -120) {
      controls.start({ x: -500, opacity: 0 });
      setTimeout(onPass, 200);
    } else {
      controls.start({ x: 0 });
    }
  };

  const CardContent = (
    <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center w-full max-w-xs mx-auto">
      <div className="w-24 h-24 bg-gray-200 rounded-full mb-4 overflow-hidden">
        {avatarUrl ? (
          <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
        ) : null}
      </div>
      <h2 className="font-semibold text-lg mb-1">{name}, {age}</h2>
      <p className="text-gray-600 mb-2 text-center">{bio}</p>
      <div className="text-xs text-gray-500 mb-2 text-center">
        <div>Region: {region}</div>
        <div>Tribe: {tribe}</div>
        <div>Religion: {religion}</div>
      </div>
      <div className="flex gap-2 mt-2">
        <button onClick={onPass} className="bg-gray-200 text-gray-700 px-4 py-2 rounded">Pass</button>
        <button onClick={onLike} className="bg-blue-600 text-white px-4 py-2 rounded">Mehwia?</button>
      </div>
    </div>
  );

  return enableSwipe ? (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      animate={controls}
      initial={{ x: 0, opacity: 1 }}
      className="touch-pan-x"
      style={{ cursor: "grab" }}
    >
      {CardContent}
    </motion.div>
  ) : (
    CardContent
  );
};

export default DiscoveryCard;
