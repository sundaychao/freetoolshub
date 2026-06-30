// 博客文章数据（硬编码示例，后续可接入 MDX）

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  date: string; // ISO 日期字符串
  author: string;
  tags: string[];
  content: string[]; // 文章段落（按顺序渲染）
};

export const posts: Post[] = [
  {
    slug: "getting-started-with-json",
    title: "Getting Started with JSON: A Beginner's Guide",
    excerpt:
      "Learn what JSON is, why it powers the modern web, and how to read and write it correctly.",
    date: "2026-01-12",
    author: "ToolHub Team",
    tags: ["JSON", "Beginner", "Web"],
    content: [
      "JSON, short for JavaScript Object Notation, is a lightweight format for storing and transporting data. It has become the de-facto standard for exchanging data between a server and a web application, and almost every modern API speaks JSON.",
      "At its core, JSON is built on two structures: a collection of name/value pairs (objects) and an ordered list of values (arrays). This simplicity is exactly why it is so popular. A JSON object is written inside curly braces, with keys as strings and values that can be strings, numbers, booleans, arrays, objects, or null.",
      "One of the most common mistakes beginners make is leaving trailing commas or using single quotes. JSON is strict: keys and string values must be wrapped in double quotes, and no trailing comma is allowed after the last item. These small rules are why a JSON formatter or validator is one of the first tools developers reach for.",
      "When you are working with JSON in code, you typically parse it into an object with JSON.parse() and turn an object back into a string with JSON.stringify(). If the input is invalid, JSON.parse() throws an error, which is why validating your JSON before using it in production is a good habit.",
      "Once you understand the basics, JSON opens the door to working with almost any API on the internet. Try pasting a real API response into a JSON formatter to see its structure clearly, and you will quickly feel at home reading nested data.",
    ],
  },
  {
    slug: "understanding-web-performance",
    title: "Understanding Web Performance and Core Web Vitals",
    excerpt:
      "A practical overview of the metrics that matter for fast, user-friendly websites.",
    date: "2026-02-03",
    author: "ToolHub Team",
    tags: ["Performance", "SEO", "Web"],
    content: [
      "Web performance is no longer a nice-to-have. It directly affects user experience, search rankings, and even revenue. Google measures real-world performance through a set of metrics called Core Web Vitals, and understanding them helps you build sites that feel fast.",
      "The three Core Web Vitals are Largest Contentful Paint (LCP), which measures loading performance and should happen within 2.5 seconds; Interaction to Next Paint (INP), which measures responsiveness and should be under 200 milliseconds; and Cumulative Layout Shift (CLS), which measures visual stability and should stay below 0.1.",
      "Improving LCP usually means serving your largest visible element faster. That involves optimizing images, reducing server response time, and removing render-blocking resources. A fast, well-cached server and properly sized images go a long way.",
      "INP replaced First Input Delay as the responsiveness metric. To keep it low, avoid long tasks on the main thread, break up heavy JavaScript, and defer non-critical work. The goal is for the page to respond to user input almost instantly.",
      "CLS is all about visual stability. Always include width and height attributes on images and videos, reserve space for ads, and avoid inserting content above existing content. Small layout shifts accumulate and frustrate users.",
      "Measuring is the first step. Use tools like Lighthouse, PageSpeed Insights, and the Chrome User Experience Report to get real data. Optimize iteratively, measure again, and keep your site fast for every visitor.",
    ],
  },
  {
    slug: "choosing-the-right-online-tool",
    title: "How to Choose the Right Online Tool for Your Workflow",
    excerpt:
      "Not all online tools are equal. Here is how to pick ones that are safe, fast, and private.",
    date: "2026-03-08",
    author: "ToolHub Team",
    tags: ["Productivity", "Tools", "Workflow"],
    content: [
      "Online tools can save hours of repetitive work, but choosing the wrong one can cost you in hidden ways. The best tools are fast, focused, and respectful of your data. Here are a few principles to keep in mind.",
      "First, prefer tools that run entirely in your browser. When a tool processes your input locally with JavaScript, your data never leaves your device. This is especially important for sensitive content like configuration files or credentials.",
      "Second, look for tools that are simple and do one thing well. A focused tool has a shorter learning curve, fewer bugs, and is easier to trust. Feature creep often leads to confusing interfaces and slower performance.",
      "Third, consider performance and reliability. A tool that loads instantly and works offline-friendly is a tool you will actually use every day. Heavy, ad-bloated pages get in the way of getting work done.",
      "Finally, check whether the tool is maintained and whether it documents how your data is handled. A clear privacy policy is a good sign that the creators take your trust seriously.",
      "At ToolHub, every tool runs in your browser, keeps your data private, and is built to be fast. Bookmark the ones you use often, and your daily workflow will thank you.",
    ],
  },
];

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug);
}
