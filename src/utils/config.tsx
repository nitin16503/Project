export const BASE_URL: string = process.env.NEXT_PUBLIC_BASE_URL || "";
export const BACKEND_URL: string = process.env.NEXT_PUBLIC_BACKEND_URL || "";
export const SOCKET_URL: string = process.env.NEXT_PUBLIC_SOCKET_URL || "";
export const PACS_URL: string = process.env.NEXT_PUBLIC_PACS_URL || "";
export const GTM_ID: string = "GTM-N54CLLTJ";
export const GA_ID: string = "G-BL5PRJMSVQ";
export const SOCKET_TOKEN: string = "rTTjeebxOqzdIVmEZUgPJcVvL1D4sj";
export const userLevelEnum: { [key: string]: string } = {
    'radiologist': "Radiologist",
    'radiologistFrontDesk': "Front Desk",
};