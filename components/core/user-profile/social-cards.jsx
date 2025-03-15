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
  Twitch,
  Link as LinkIcon
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

const platformGradients = {
  instagram: 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500',
  snapchat: 'bg-gradient-to-tr from-yellow-300 to-yellow-500',
  tiktok: 'bg-gradient-to-tr from-pink-500 via-gray-800 to-blue-400',
  douyin: 'bg-gradient-to-tr from-pink-500 via-gray-800 to-blue-400'
};

export const SocialCards = ({ title, url, color = '1F2937', size = 'normal' }) => {
  const platform = title.toLowerCase();
  const Icon = socialIcons[platform] || LinkIcon;
  
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

  const hasGradient = platform in platformGradients;

  return (
    <div 
      className={`
        ${sizeClasses[size]} 
        rounded-full 
        ${hasGradient ? platformGradients[platform] : 'bg-slate-100'} 
        hover:scale-110 
        transition-all 
        duration-200 
        flex 
        items-center 
        justify-center 
        group 
        relative
        overflow-hidden
      `}
      style={!hasGradient ? { 
        color: platformColors[platform] || `#${color}`,
        backgroundColor: `${platformColors[platform]}10` 
      } : {
        color: 'white'
      }}
    >
      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity" />
      <Icon 
        className={`
          ${iconSizes[size]} 
          transition-all 
          duration-200 
          group-hover:scale-110 
          relative 
          z-10
        `} 
      />
      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20">
        {title}
      </div>
    </div>
  );
};
