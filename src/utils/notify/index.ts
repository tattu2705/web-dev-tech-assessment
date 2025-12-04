import { notification } from "antd";

export const notifyError = (title: string, description?: string) => {
  notification.error({
    description,
    placement: "topRight",
    title,
  });
};

export const notifySuccess = (title: string, description?: string) => {
  notification.success({
    description,
    placement: "topRight",
    title,
  });
};
