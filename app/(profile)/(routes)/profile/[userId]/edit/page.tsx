import EditProfile from "@/components/toffee/profile/Elements/EditProfile";
import prismadb from "@/lib/prismadb";
import { stripe } from "@/lib/stripe/config"
interface ProfilePageProps {
  params: {
    userId: string;
  };
}
const EditProfilePage = async ({ params }: ProfilePageProps) => {
  const user = await prismadb.userSettings.findUnique({
    where: {
      userId: params.userId
    },
    select: {
      name: true,
      email: true,
      profile_image: true,
      banner_image: true,
      shared: true,
      language: true,
      password: true,
      chat_background_image: true,
      linkedin: true,
      telegram: true,
      instagram: true,
      twitter: true,
      plan: true,
      customerId: true,
      mta: true,
      characters: {
        select: {
          id: true,
          name: true,
          description: true,
          image: true,
          _count: {
            select: {
              messages: true
            }
          }
        }
      }
    }
  });
  const customerId = user?.customerId;
  let subscriptionEndDate = "";
  if (customerId) {
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
    });

    const activeSubscription = subscriptions.data.find(
      (sub) => sub.status === 'active'
    );
    if (activeSubscription) {
      subscriptionEndDate = new Date(activeSubscription.current_period_end * 1000).toISOString()
    }
  }
  return (
    <EditProfile userId={params.userId} user={user} subscriptionEndDate={subscriptionEndDate}/>
  )
}

export default EditProfilePage;