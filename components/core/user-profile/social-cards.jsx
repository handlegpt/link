/* eslint-disable @next/next/no-img-element */
import { getApexDomain, removeHashFromHexColor } from '@/utils/helpers';
import { 
  Twitter, 
  Facebook, 
  Instagram, 
  Linkedin, 
  Github, 
  Youtube,
  MessageCircle,
  Send,
  Phone,
  Globe
} from 'lucide-react';

const socialIcons = {
  twitter: Twitter,
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  github: Github,
  youtube: Youtube,
  tiktok: MessageCircle,
  telegram: Send,
  whatsapp: Phone,
  wechat: MessageCircle,
  weibo: Globe,
  discord: MessageCircle,
};

export const SocialCards = ({ title, url, color = '1F2937', size = 'normal' }) => {
  const platform = title.toLowerCase();
  const Icon = socialIcons[platform] || Globe;
  
  const sizeClasses = {
    small: 'w-8 h-8',
    normal: 'w-10 h-10',
    large: 'w-12 h-12'
  };

  return (
    <div 
      className={`${sizeClasses[size]} rounded-full bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center`}
      style={{ color: `#${color}` }}
    >
      <Icon className="w-5 h-5" />
    </div>
  );
};
