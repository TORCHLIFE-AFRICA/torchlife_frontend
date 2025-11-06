"use client";

import { CardContent } from "@mui/material";
import Image from "next/image";
import { CardWrapper, ImageBox } from "./styles";
import { Font600Bold30, Font600Normal18 } from "@/utils/typography";

interface InfoCardProps {
  image: string;
  title: string;
  description: string;
}

export default function InfoCard({ image, title, description }: InfoCardProps) {
  return (
    <CardWrapper>
      <ImageBox>
        <Image
          src={image}
          alt={title}
          width={100}
          height={114}
          style={{ objectFit: "contain" }}
        />
      </ImageBox>
      <CardContent>
        <Font600Bold30>
          {title}
        </Font600Bold30>
        <br />
        <Font600Normal18>
          {description}
        </Font600Normal18>
      </CardContent>
    </CardWrapper>
  );
}
