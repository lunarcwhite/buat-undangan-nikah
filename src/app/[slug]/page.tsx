import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import ThemeWrapper from '@/components/Invitation/ThemeWrapper';
import Hero from '@/components/Invitation/Hero';
import Info from '@/components/Invitation/Info';
import RSVPForm from '@/components/Invitation/RSVPForm';
import Guestbook from '@/components/Invitation/Guestbook';
import InvitationClientContainer from '@/components/Invitation/InvitationClientContainer';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function InvitationPage({ params }: Props) {
  const { slug } = await params;

  // Fetch invitation matching the slug
  const { data: invitation, error } = await supabase
    .from('invitations')
    .select('*')
    .eq('slug', slug)
    .single();

  // Redirect to standard 404 if invitation missing
  if (error || !invitation) {
    notFound();
  }

  const contentData = (invitation.content_data || {}) as any;
  const themeConfig = (invitation.theme_config || {}) as any;

  return (
    <ThemeWrapper themeConfig={themeConfig}>
      <InvitationClientContainer contentData={contentData} invitationId={invitation.id}>
        <main className="max-w-2xl mx-auto bg-card shadow-lg min-h-screen border-x border-muted">
          <Hero contentData={contentData} />
          
          <Info contentData={contentData} />
          
          <RSVPForm invitationId={invitation.id} />
          
          <Guestbook invitationId={invitation.id} />
        </main>
      </InvitationClientContainer>
    </ThemeWrapper>
  );
}

