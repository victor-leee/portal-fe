import React from "react";

export interface TreeNode {
    title: string,
    key: React.Key,
    isLeaf?: boolean,
    children?: TreeNode[]
}