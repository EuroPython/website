import { getCollection, getEntry } from "astro:content";
import type { APIRoute } from "astro";
import { sponsorDisplay } from "@data/sponsorDisplay";
import { getImage } from "astro:assets";

const siteUrl = import.meta.env.SITE;

export const GET: APIRoute = async () => {
  const allJobs = await getCollection("jobs");

  const jobs = await Promise.all(
    allJobs
      .filter((job) => !job.data.draft)
      .map(async (job) => {
        const sponsorId = job.id.split("/")[0];
        const sponsor = await getEntry("sponsors", sponsorId);

        if (!sponsor) {
          throw new Error(`Sponsor with ID "${job.data.sponsor}" not found`);
        }

        const image = sponsorDisplay[sponsorId];
        const processedImage = image
          ? await getImage({ src: image, format: "webp" })
          : null;

        return {
          id: job.id,
          title: `${sponsor.data.name} - ${job.data.title}`,
          location: job.data.location,
          type: job.data.type,
          level: job.data.level,
          salary: job.data.salary,
          tags: job.data.tags,
          description: job.data.description,
          responsibilities: job.data.responsibilities,
          min_requirements: job.data.min_requirements,
          requirements: job.data.requirements,
          preferred: job.data.preffered,
          stack: job.data.stack,
          benefits: job.data.benefits,
          description2: job.data.description2,
          apply_link: `${siteUrl}${job.id}`,
          sponsor: sponsor.data.name,
          sponsor_description: sponsor.data.description,
          sponsor_image: `${siteUrl}${processedImage?.src || ""}`,
        };
      })
  );

  return new Response(JSON.stringify(jobs, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
