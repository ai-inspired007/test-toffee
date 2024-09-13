import SettingsPage from "@/components/toffee/settings";
import { auth } from "auth";
import prismadb from "@/lib/prismadb";
import { ThemeType } from "@prisma/client";

const Settings = async () => {
  const session = await auth();
  const user = session?.user;
  const userId = user?.id || "public";
  console.log(userId)
  const chatSetting = await prismadb.chatSetting.findFirst({
    where: {
      userId: userId
    },
    select: {
      chat_model: true,
      prompt: true,
      voiceId: true,
      themeId: true,
    },
  });

  const voices = await prismadb.voice.findMany({
    where: {
      OR: [
        { sharing: "public" },
        { userId: userId },
      ]
    },
  });

  const chatThemes = await prismadb.chatTheme.findMany({
    where: {
      OR: [
        { userId: userId },
        { shared: ThemeType.Public },
      ]
    }
  });

  return (
    <SettingsPage chatSetting={chatSetting} voices={voices} chatThemes={chatThemes} />
  );
};

export default Settings;