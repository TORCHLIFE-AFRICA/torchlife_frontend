import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import Image from 'next/image';

interface InfoCardProps {
  image: string;
  title: string;
  description: string;
}

const InfoCard: React.FC<InfoCardProps> = ({ image, title, description }) => {
  return (
    <Card sx={{ maxWidth: 300, borderRadius: 2, boxShadow: 3 }}>
      <Box sx={{ height: 200, position: 'relative' }}>
        <Image
          src={image}
          alt={title}
          fill
          style={{ objectFit: 'cover', borderRadius: '8px 8px 0 0' }}
        />
      </Box>
      <CardContent>
        <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 1 }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default InfoCard;