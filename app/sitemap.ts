import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";
import { siteUrl } from "@/lib/site";
import { VIDEOS } from "@/lib/videos";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const pages = ["", "/blog", "/tecnicas", "/contato", ...(VIDEOS.length ? ["/videos"] : [])];

  return [
    ...pages.map((path) => ({ url: `${base}${path}` })),
    ...getAllPosts().map((post) => ({
      url: `${base}/blog/${post.slug}`,
      lastModified: post.date,
    })),
  ];
}
