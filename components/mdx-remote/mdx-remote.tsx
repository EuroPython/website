"use client";

import { components } from "components/mdx";

import { MDXRemote as OriginalMDXRemote } from "next-mdx-remote";

export const MDXRemote = ({ source, ...props }: any) => {
  return (
    <OriginalMDXRemote {...props} components={components} source={source} />
  );
};
