import { Router } from "express";
import { getSettings } from "../settings";

const router = Router();

router.get("/public", async (_req, res) => {
  try {
    const s = await getSettings();
    res.json({
      settings: {
        name: s.name,
        tagline: s.tagline,
        logo: s.logo,
        whatsapp: s.whatsapp,
        phone: s.phone,
        email: s.email,
        vodafoneWallet: s.vodafoneWallet,
        freeShippingThreshold: s.freeShippingThreshold,
        codFee: s.codFee,
        governorates: s.governorates,
      },
    });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;