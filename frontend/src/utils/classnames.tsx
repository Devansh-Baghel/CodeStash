import { useUserStore } from "@/store/userStore";
// export const cardLayout = "w-[90vw] max-w-[700px] md:w-[60vw]";
// export const cardLayout = "max-w-[630px] xl:max-w-full xl:mr-10";

export const cardLayout = `${useUserStore.getState().showProfileCard ? "max-w-[700px]" : "max-w-full"} lg:mr-8`;
export const nextblue = "bg-[#c7d7fc]";
