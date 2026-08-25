import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authenticatedMiddleware } from "./middleware";
import { getStorage } from "~/utils/storage";
import type { AttachmentType } from "~/db/schema";

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm"];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB

function getAttachmentType(mimeType: string): AttachmentType | null {
  if (ALLOWED_IMAGE_TYPES.includes(mimeType)) return "image";
  if (ALLOWED_VIDEO_TYPES.includes(mimeType)) return "video";
  return null;
}

function getMaxSize(type: AttachmentType): number {
  return type === "image" ? MAX_IMAGE_SIZE : MAX_VIDEO_SIZE;
}

export const getMediaUploadUrlFn = createServerFn({ method: "POST" })
  .middleware([authenticatedMiddleware])
  .inputValidator(
    z.object({
      fileName: z.string(),
      contentType: z.string(),
      fileSize: z.number(),
    })
  )
  .handler(async ({ data, context }) => {
    const userId = context.userId;
    const { fileName, contentType, fileSize } = data;

    const attachmentType = getAttachmentType(contentType);
    if (!attachmentType) {
      throw new Error(
        `Invalid file type: ${contentType}. Allowed: images (jpg, png, gif, webp) and videos (mp4, webm)`
      );
    }

    const maxSize = getMaxSize(attachmentType);
    if (fileSize > maxSize) {
      const maxSizeMB = Math.round(maxSize / 1024 / 1024);
      throw new Error(
        `File too large. Maximum ${attachmentType} size is ${maxSizeMB}MB`
      );
    }

    const fileExtension = fileName.split(".").pop() || "";
    const attachmentId = crypto.randomUUID();
    const fileKey = `attachments/${userId}/${attachmentId}.${fileExtension}`;

    const { storage } = getStorage();
    const presignedUrl = await storage.getPresignedUploadUrl(
      fileKey,
      contentType
    );

    return {
      presignedUrl,
      fileKey,
      attachmentId,
      attachmentType,
    };
  });

export const getAttachmentUrlFn = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      fileKey: z.string(),
    })
  )
  .handler(async ({ data }) => {
    const { storage } = getStorage();
    const url = await storage.getPresignedUrl(data.fileKey);
    return { url };
  });

export const getMultipleAttachmentUrlsFn = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      fileKeys: z.array(z.string()),
    })
  )
  .handler(async ({ data }) => {
    const { storage } = getStorage();
    const urls: Record<string, string> = {};

    await Promise.all(
      data.fileKeys.map(async (fileKey) => {
        urls[fileKey] = await storage.getPresignedUrl(fileKey);
      })
    );

    return { urls };
  });
