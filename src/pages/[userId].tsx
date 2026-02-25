import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { prisma } from "@/lib/prisma";
import { UserProfile } from "@/types";

interface Props {
  initialProfile: UserProfile | null;
}

export default function UserPage({ initialProfile }: Props) {
  const [profile, setProfile] = useState<UserProfile | null>(initialProfile);
  const router = useRouter();
  const { userId } = router.query;

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Profile not found</p>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto px-4 py-16">
      <div className="text-center space-y-4">
        {profile?.avatar && (
          <div className={`mx-auto overflow-hidden mb-6 ${
            profile.imageShape === 'circle' ? 'w-32 h-32 rounded-full' :
            profile.imageShape === 'square' ? 'w-32 h-32 rounded-[30px]' :
            'w-32 h-48 rounded-[30px]'
          } shadow-lg hover:shadow-xl transition-shadow duration-300 bg-background/50 backdrop-blur-sm`}>
            <div className="relative w-full h-full">
              <img
                src={profile.avatar}
                alt={profile.name}
                className="absolute w-full h-auto min-h-full object-cover"
                style={{
                  top: `${-1 * profile.imagePosition}%`,
                  transform: profile.imageShape === 'portrait' ? 'scale(1.2)' : 'scale(1.1)'
                }}
              />
            </div>
          </div>
        )}

        <h1 className="text-2xl font-bold">{profile.name}</h1>
        {profile.role && <p className="text-muted-foreground">{profile.role}</p>}
        {profile.bio && <p className="max-w-md mx-auto">{profile.bio}</p>}

        {profile.socialLinks && profile.socialLinks.length > 0 && (
          <div className="grid gap-4 mt-8">
            {profile.socialLinks.map((link) => {
              if (!link.url) return null;
              return (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-card p-4 flex items-center justify-between hover:opacity-80 transition-all duration-300 rounded-[20px] shadow-lg hover:shadow-xl hover:translate-y-[-2px]"
                >
                  <span className="text-lg">
                    {link.platform === 'other' ? link.customPlatform : link.platform}
                  </span>
                </a>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const userId = params?.userId as string;

  try {
    const profile = await prisma.userProfile.findUnique({
      where: { userId },
    });

    return {
      props: {
        initialProfile: profile,
      },
    };
  } catch (error) {
    return {
      props: {
        initialProfile: null,
      },
    };
  }
};
