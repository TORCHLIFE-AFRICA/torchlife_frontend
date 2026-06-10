export type FundraiserAction = {
  id: string;
  label: string;
  primary?: boolean;
};

export type ImpactArea = {
  id: string;
  title: string;
  progressLabel: string;
};

export type ExpertResource = {
  id: string;
  title: string;
  readTime: string;
  image: string;
  featured?: boolean;
};

export type FooterGroup = {
  id: string;
  title: string;
  links: string[];
};
