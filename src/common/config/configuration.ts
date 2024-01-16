export interface ConfigVariablesType {
  config: {
    app: {
      port: number;
      client_url: string;
    };
    email: {
      admin: string;
    };
    database: {
      host: string;
      name: string;
      username: string;
      password: string;
      port: number;
    };
    mail: {
      host: string;
      username: string;
      password: string;
      port: number;
    };
    jwt: {
      secret_key: string;
      expiry_time: string;
      refresh_secret_key: string;
      refresh_expiry_time: string;
    };
    hashing: {
      salt_or_rounds: string;
      encryption_key: string;
    };
    razorpay: {
      key_id: string;
      key_secret: string;
    };
    zoom: {
      api: {
        key: string;
        secret: string;
      };
      sdk: {
        key: string;
        secret: string;
      };
    };
  };
}

export const config: ConfigVariablesType = {
  config: {
    app: {
      port: parseInt(process.env.PORT, 10) || 8800,
      client_url: process.env.CLIENT_URL,
    },
    email: {
      admin: process.env.ADMIN_EMAIL,
    },
    database: {
      host: process.env.DATABASE_HOST,
      name: process.env.DATABASE_NAME,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      port: parseInt(process.env.DATABASE_PORT, 10) || 3306,
    },
    mail: {
      host: process.env.MAIL_HOST,
      username: process.env.MAIL_USERNAME,
      password: process.env.MAIL_PASSWORD,
      port: parseInt(process.env.MAIL_PORT, 10) || 3306,
    },
    jwt: {
      secret_key: process.env.JWT_SECRET_KEY,
      expiry_time: process.env.JWT_EXPIRY_TIME,
      refresh_secret_key: process.env.JWT_REFRESH_SECRET_KEY,
      refresh_expiry_time: process.env.JWT_REFRESH_EXPIRY_TIME,
    },
    hashing: {
      salt_or_rounds: process.env.SALT_OR_ROUNDS,
      encryption_key: process.env.ECRYPTION_KEY,
    },
    razorpay: {
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    },
    zoom: {
      api: {
        key: process.env.ZOOM_API_KEY,
        secret: process.env.ZOOM_API_SECRET,
      },
      sdk: {
        key: process.env.ZOOM_SDK_KEY,
        secret: process.env.ZOOM_SDK_SECRET,
      },
    },
  },
};

export default () => ({ ...config });
