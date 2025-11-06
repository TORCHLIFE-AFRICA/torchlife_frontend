import InfoCard from "@/components/card/infoCard";
import { Box } from "@mui/material";

export default function InfoCardSection() {
  const cards = [
    {
      image: "/assets/img1.jpg",
      title: "Verified Campaigns Only",
      description:
        "Every campaign is reviewed by a dedicated manager who visits partner hospitals to confirm medical reports before approval.",
    },
    {
      image: "/assets/img2.jpg",
      title: "Secure Donations",
      description:
        "Your donations are processed through encrypted and traceable channels. Every transaction is secure from your wallet to the beneficiary.",
    },
    {
      image: "/assets/img1.jpg",
      title: "Direct Impact",
      description:
        "Funds go directly to verified mothers once their campaigns are approved. No middlemen, just real support.",
    },
  ];

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        mt: 4,
        gap: '15px',
      }}
    >
      {cards.map((card, index) => (
        <InfoCard key={index} {...card} />
      ))}
    </Box>
  );
}
