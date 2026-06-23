import { Request, Response } from "express";
import { buildMetricsForUser } from "./metrics.service";

export const dashboardController = {
  async overview(req: Request, res: Response) {
    const { metrics, needsReauth, connectedNetworks } = await buildMetricsForUser(
      req.userId!
    );

    const totalFollowers = metrics.reduce((acc, m) => acc + m.followers, 0);
    const totalAvgViews = metrics.reduce((acc, m) => acc + (m.avgViews ?? 0), 0);
    const avgEngagementRate =
      metrics.length > 0
        ? metrics.reduce((acc, m) => acc + m.engagementRate, 0) / metrics.length
        : 0;

    res.json({
      totalFollowers,
      avgEngagementRate: Number(avgEngagementRate.toFixed(1)),
      totalAvgViews,
      connectedNetworks,
      needsReauth,
      metrics
    });
  }
};
