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
  Globe,
  Music2,
  Mail,
  Store,
  Camera,
  BookOpen,
  Twitch
} from 'lucide-react';

const socialIcons = {
  twitter: Twitter,
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  github: Github,
  youtube: Youtube,
  tiktok: Music2,
  telegram: Send,
  whatsapp: Phone,
  wechat: MessageCircle,
  weibo: Globe,
  discord: MessageCircle,
  email: Mail,
  shop: Store,
  snapchat: Camera,
  medium: BookOpen,
  twitch: Twitch,
  bilibili: Globe,
  zhihu: Globe,
  douyin: Music2
};

const platformColors = {
  twitter: '#1DA1F2',
  facebook: '#1877F2',
  instagram: '#E4405F',
  linkedin: '#0A66C2',
  github: '#181717',
  youtube: '#FF0000',
  tiktok: '#000000',
  telegram: '#26A5E4',
  whatsapp: '#25D366',
  wechat: '#07C160',
  weibo: '#E6162D',
  discord: '#5865F2',
  email: '#EA4335',
  shop: '#FF9900',
  snapchat: '#FFFC00',
  medium: '#000000',
  twitch: '#9146FF',
  bilibili: '#00A1D6',
  zhihu: '#0084FF',
  douyin: '#000000'
};

export const SocialCards = ({ title, url, color = '1F2937', size = 'normal' }) => {
  const platform = title.toLowerCase();
  const Icon = socialIcons[platform] || Globe;
  
  const sizeClasses = {
    small: 'w-8 h-8',
    normal: 'w-10 h-10',
    large: 'w-12 h-12'
  };

  const iconSizes = {
    small: 'w-4 h-4',
    normal: 'w-5 h-5',
    large: 'w-6 h-6'
  };

  return (
    <div 
      className={`${sizeClasses[size]} rounded-full bg-slate-100 hover:bg-slate-200 hover:scale-110 transition-all duration-200 flex items-center justify-center group relative`}
      style={{ 
        color: platformColors[platform] || `#${color}`,
        backgroundColor: `${platformColors[platform]}10` 
      }}
    >
      <Icon className={`${iconSizes[size]} transition-transform duration-200 group-hover:scale-110`} />
      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        {title}
      </div>
    </div>
  );
};
