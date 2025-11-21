"use client";
import { COLORS } from "@/utils/colors";
import styled from "@emotion/styled";


export const FileUploadWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  height: 56px;
  width: 100%;
  background-color: ${COLORS.green10};
  border-radius: 4px;
  border: 1px dashed ${COLORS.gray100};
  position: relative;
  cursor: pointer;
`;

export const FileUploadPreviewWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 4px;
  height: 56px;
  width: 100%;
  border-radius: 4px;
  position: relative;
  padding: 8px;
  margin-top: 16px;
  background-color: ${COLORS.gray100};
  word-wrap: break-word;
  word-break: break-word;
  overflow: hidden;

  img {
    width: 40px;
    height: 40px;
    border-radius: 2px;
    object-fit: cover;
  }
`;
