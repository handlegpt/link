/* eslint-disable @next/next/no-img-element */
import LinkCard from '@/components/core/user-profile/links-card';
import * as Avatar from '@radix-ui/react-avatar';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';
import useUser from '@/hooks/useUser';
import Loader from '@/components/utils/loading-spinner';
import NotFound from '@/components/utils/not-found';
import useLinks from '@/hooks/useLinks';
import Script from 'next/script';
import { SocialCards } from '@/components/core/user-profile/social-cards';
import Head from 'next/head';
import Image from 'next/image';
import { motion } from 'framer-motion';

const ProfilePage = () => {
  const { query } = useRouter();
  const { handle } = query;

  const {
    data: fetchedUser,
    isLoading: isUserLoading,
    isFetching: isUserFetching,
  } = useUser(handle);

  const { data: userLinks, isFetching: isLinksFetching } = useLinks(
    fetchedUser?.id
  );

  const queryClient = useQueryClient();
  const [, setIsDataLoaded] = useState(false);

  const mutation = useMutation(
    async (id) => {
      await axios.patch(`/api/analytics/clicks/${id}`);
    },
    {
      onError: (error) => {
        toast.error(
          (error.response && error.response.data.message) || 'An error occurred'
        );
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['links', fetchedUser?.id] });
        queryClient.invalidateQueries({ queryKey: ['users', fetchedUser?.id] });
      },
    }
  );

  const handleRegisterClick = async (id) => {
    await mutation.mutateAsync(id);
  };

  useEffect(() => {
    window.addEventListener('message', () => {
      queryClient.invalidateQueries({ queryKey: ['links'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    });

    return () => {
      window.removeEventListener('message', () => {
        queryClient.invalidateQueries({ queryKey: ['links'] });
        queryClient.invalidateQueries({ queryKey: ['users'] });
      });
    };
  }, [queryClient]);

  useEffect(() => {
    if (fetchedUser && userLinks) {
      setIsDataLoaded(true);
    }
  }, [fetchedUser, userLinks]);

  if (isUserLoading) {
    return <Loader message={'Loading...'} bgColor="black" textColor="black" />;
  }

  if (!fetchedUser?.id) {
    return <NotFound />;
  }

  const buttonStyle = fetchedUser?.buttonStyle;
  const theme = {
    primary: fetchedUser?.themePalette.palette[0],
    secondary: fetchedUser?.themePalette.palette[1],
    accent: fetchedUser?.themePalette.palette[2],
    neutral: fetchedUser?.themePalette.palette[3],
  };

  const regularLinks = userLinks?.filter(link => !link.isSocial && !link.archived) || [];
  const socialLinks = userLinks?.filter(link => link.isSocial && !link.archived) || [];

  return (
    <>
      <Head>
        <title> @{handle} | Librelinks</title>
      </Head>
      {!query.isIframe ? (
        <Script
          defer
          src="https://unpkg.com/@tinybirdco/flock.js"
          data-host="https://api.tinybird.co"
          data-token={process.env.NEXT_PUBLIC_DATA_TOKEN}
        />
      ) : (
        ''
      )}
      <section
        style={{ background: theme.primary }}
        className="h-[100vh] w-[100vw] no-scrollbar overflow-auto"
      >
        <div className="flex items-center w-full mt-4 flex-col mx-auto max-w-3xl justify-center px-8 lg:mt-16">
          {(isLinksFetching || isUserFetching) && (
            <div className="absolute -top-5 left-2">
              <Loader
                strokeWidth={7}
                width={15}
                height={15}
                bgColor={theme.accent}
              />
            </div>
          )}
          <Avatar.Root
            className="inline-flex h-[70px] w-[70px] border-2 border-blue-300
						items-center justify-center overflow-hidden rounded-full align-middle lg:w-[96px] lg:h-[96px]"
          >
            <Avatar.Image
              className="h-full w-full rounded-[inherit] object-cover"
              src={fetchedUser && fetchedUser?.image}
              referrerPolicy="no-referrer"
              alt="avatar"
            />
            <Avatar.Fallback
              className="leading-1 flex h-full w-full items-center justify-center bg-white text-[15px] font-medium"
              delayMs={100}
            >
              @
            </Avatar.Fallback>
          </Avatar.Root>
          <p
            style={{ color: theme.accent }}
            className="font-bold text-white text-center text-sm mt-4 mb-2 lg:text-xl lg:mt-4"
          >
            {fetchedUser?.name}
          </p>
          {fetchedUser?.bio && (
            <p
              style={{ color: theme.accent }}
              className="w-[150px] truncate text-center text-sm mt-1 mb-4 lg:text-xl lg:mb-4 lg:w-[600px] "
            >
              {fetchedUser?.bio}
            </p>
          )}
          {socialLinks.length > 0 && (
            <div className="w-full max-w-[480px] mx-auto mb-8">
              <div className="flex flex-wrap justify-center gap-4 px-4">
                {socialLinks.map(link => (
                  <motion.div
                    key={link.id}
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.9 }}
                    transition={{ 
                      duration: 0.3,
                      delay: link.order * 0.1 
                    }}
                  >
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleRegisterClick(link.id)}
                      className="inline-block transform hover:-translate-y-1 transition-transform duration-200"
                    >
                      <SocialCards
                        title={link.title}
                        url={link.url}
                        color={theme.accent.replace('#', '')}
                        size={socialLinks.length > 6 ? 'small' : 'normal'}
                      />
                    </a>
                  </motion.div>
                ))}
              </div>
              {socialLinks.length > 6 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-center mt-2"
                >
                  <p className="text-xs text-slate-500">
                    {socialLinks.length} 个社交链接
                  </p>
                </motion.div>
              )}
            </div>
          )}
          {userLinks
            ?.filter((link) => !link.isSocial)
            .map(({ id, ...link }) => (
              <LinkCard
                buttonStyle={buttonStyle}
                theme={theme}
                id={id}
                key={id}
                {...link}
                registerClicks={() => handleRegisterClick(id)}
              />
            ))}

          {userLinks?.length === 0 && (
            <div className="flex justify-center">
              <h3
                style={{ color: theme.neutral }}
                className="pt-8 text-md text-white font-semibold lg:text-2xl"
              >
                Hello World 🚀
              </h3>
            </div>
          )}
        </div>
        <div className="my-10 lg:my-24" />
        {userLinks?.length > 0 ? (
          <footer className="relative left-1/2 bottom-0 transform -translate-x-1/2 w-[200px]">
            <p
              style={{ color: theme.accent }}
              className="text-sm text-semibold text-center w lg:text-lg"
            >
              Made with{' '}
              <Link
                className="font-semibold"
                target="_blank"
                href="https://librelinks.vercel.app/"
              >
                Librelinks
              </Link>
            </p>
          </footer>
        ) : (
          ''
        )}
      </section>
    </>
  );
};

export default ProfilePage;
