'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import TryEditor from '@/components/editor/TryEditor';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function FreePage() {
  const router = useRouter();
  const [projectData] = useState({
    name: 'Sample Project',
    description: 'Try out our editor!',
    content: '',
    shared: false
  });

  const handleSave = () => {
    toast.error('Please login to save your work', {
      action: {
        label: 'Login',
        onClick: () => router.push('/login')
      }
    });
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-50 to-white">
  
      <div className=" ">
        <TryEditor
          initialData={projectData}
          readOnly={false}
        />
      </div>
    </div>
  );
}
