import { Story, StoryPage } from "@/types";

// All images from pagesimages folder (pages 1-19, last 3 for LastPage)
const PAGE_IMAGES = [
  "/pagesimages/page-1.png",
  "/pagesimages/page-2.png",
  "/pagesimages/page-3.png",
  "/pagesimages/page-4.png",
  "/pagesimages/page-5.png",
  "/pagesimages/page-6.png",
  "/pagesimages/page-7.png",
  "/pagesimages/page-8.png",
  "/pagesimages/page-9.png",
  "/pagesimages/page-10.png",
  "/pagesimages/page-11.png",
  "/pagesimages/page-12.png",
  "/pagesimages/page-13.png",
  "/pagesimages/page-14.png",
  "/pagesimages/page-15.png",
  "/pagesimages/page-16.png",
  "/pagesimages/page-17.png",
  "/pagesimages/page-18.png",
  "/pagesimages/page-19.png",
];

export const STORY: Story = {
  id: "falcon-story",
  theme: "kingdom",
  title: "رحلة الصقر",
  dedication: "",
  pages: PAGE_IMAGES.map((img, index): StoryPage => ({
    id: index + 1,
    illustration: img,
    text: "",
    backgroundColor: "#000",
  })),
};

export function getStory(): Story {
  return STORY;
}
