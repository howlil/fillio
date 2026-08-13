export type StoredProfileEnvelope = {
  schemaVersion: 1;
  baseProfile: {
    personal: {
      legalName: {
        first: string;
        middle: string;
        last: string;
      };
      preferredName: string;
    };
    professional: {
      experiences: unknown[];
      education: unknown[];
      skills: unknown[];
    };
  };
  variants: unknown[];
  preferences: Record<string, never>;
  metadata: {
    createdAt: string;
    updatedAt: string;
  };
};
