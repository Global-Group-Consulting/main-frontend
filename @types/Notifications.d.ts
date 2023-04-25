export interface NotificationData {
  title: string;
  content: string;
  app: string;
  type: string;
  platforms: string[];
  action?: {
    text: string;
    link: string;
  };
  extraData: any;
  receiver: {
    '_id': string;
    'firstName': string;
    'lastName': string;
    'email': string
  };
}

export interface Notification {
  _id: string;
  id: string;
  type: string;
  data: NotificationData;
  read_at: string | null;
  notifiable_id: string;
  notifiable_type: string;
  updated_at: string;
  created_at: string;
}
