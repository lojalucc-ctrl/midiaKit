import { Request, Response } from "express";
import { profileService } from "./profile.service";
import { updateProfileSchema } from "./profile.schema";
import { toPublicProfile } from "@/utils/mappers";

export const profileController = {
  async get(req: Request, res: Response) {
    const profile = await profileService.getByUserId(req.userId!);
    res.json(toPublicProfile(profile));
  },

  async update(req: Request, res: Response) {
    const input = updateProfileSchema.parse(req.body);
    const profile = await profileService.update(req.userId!, input);
    res.json(toPublicProfile(profile));
  }
};
