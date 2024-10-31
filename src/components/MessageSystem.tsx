import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useParams, Link } from 'react-router-dom';
import { sendMessage, subscribeToMessages } from '../utils/firebase';
import { 
  Send, ArrowLeft, Search, Heart, Bell, 
  Paperclip, Image, Smile, Mic, Video,
  MessageCircle, MessageSquare
} from 'lucide-react';

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: any;
}

const MessageSystem: React.FC = () => {
  // ... rest of the component code remains the same until the buttons section

  <div className="mt-6 flex justify-center space-x-4">
    <button className="flex flex-col items-center text-gray-600 hover:text-blue-500">
      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-1">
        <MessageSquare className="h-6 w-6" />
      </div>
      <span className="text-sm">Chat</span>
    </button>
    <button className="flex flex-col items-center text-gray-600 hover:text-blue-500">
      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-1">
        <Video className="h-6 w-6" />
      </div>
      <span className="text-sm">Video Call</span>
    </button>
  </div>

  // ... rest of the component remains the same
};

export default MessageSystem;