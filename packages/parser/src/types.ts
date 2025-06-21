import type {
  IS_SELF_CLOSING,
  IS_SPREAD,
  JAVASCRIPT_TAG,
  STYLE_TAG,
} from "./constants.js";
type NodeTypes = {
  TAG: 1;
  ATTR: 2;
  TEXT: 3;
  CDATA: 4;
  COMMENT: 8;
  DOCUMENT: 9;
  DOCTYPE: 10;
  DOCUMENT_FRAGMENT: 11;
};
export type Expr = {
  unescape?: string;
  expressions?: {
    end?: number;
    text?: string;
    start?: number;
  }[];
  end?: number;
};

export type ParserState = Node &
  ExpressionContainer & {
    isVoid?: boolean;
    nodes?: ParserState[];
    pos?: number;
    data?: string;
    scryle?: ParserState | string;
    options?: {
      brackets?: [string, string];
      comments?: boolean;
    };
    close?: string;
    root?: ParserState;
    last?: ParserState;
    text?: string | ParserState;
    count?: number;
    name?: string;
    regexCache?: Record<string, RegExp>;
    [IS_SELF_CLOSING]?: boolean;
    builder?: Builder;
    stack?: ParserState[];
  };

type Store = {
  [STYLE_TAG]?: TagNode;
  [JAVASCRIPT_TAG]?: TagNode;
} & ParserState;

export type Builder = {
  compact: boolean;
  store: Store;
  get(): ParserOutput;
  push(node: ParserState): void;
  pushComment(store: Store, node: ParserState): void;
  closeTag(store: Store, node: ParserState): void;
  openTag(store: Store, node: ParserState): void;
  pushText(store: Store, node: ParserState): void;
  split(node: Store, source: string, start: number, pack: any): void;
  sanitise(node: Store, text: string, pack: any): void;
  attrs(attributes: Attribute[]): void;
};

export type Position = {
  start?: number;
  end?: number;
};

export type Expression = Position & {
  text?: string;
};

export type ExpressionContainer = {
  expressions?: Expression[];
  unescape?: string;
  parts?: string[];
};

export type Attribute = Position &
  ExpressionContainer & {
    name?: string;
    value?: string;
    valueStart?: number;
    [IS_SPREAD]?: boolean;
  };

export type Node = Position & {
  type?: number;
};

export type TagNode = Node & {
  type?: NodeTypes["TAG"];
  name: string;
  isRaw?: boolean;
  isCustom?: boolean;
  isVoid?: boolean;
  attributes?: Attribute[];
  selfclose?: boolean;
  nodes: Node[];
};

export type CommentNode = Node & {
  type: NodeTypes["COMMENT"];
};

export type TextNode = Node &
  ExpressionContainer & {
    type: NodeTypes["TEXT"];
    text: string;
  };

export type ParsedNode = TagNode | TextNode | CommentNode;

export type ParserOutput = {
  javascript: ScriptNode | null;
  css: StyleNode | null;
  template: TemplateNode | null;
};

export type TreeBuilder = {
  get(): ParserOutput;
  push(node: ParsedNode): void;
};

export type ParserOptions = {
  brackets?: [string, string];
  comments?: boolean;
  compact?: boolean;
};

export type ParserResult = {
  data: string;
  output: ParserOutput;
};

export type RiotNode = TemplateNode | TextNode | ScriptNode | StyleNode;

export type TemplateNode = TagNode & {
  nodes?: RiotNode[];
};

export type ScriptNode = TagNode & {
  name: "script";
  text?: TextNode;
};

export type StyleNode = TagNode & {
  name: "style";
  text?: TextNode;
};

export type Parser = (
  options: ParserOptions,
  treeBuilder?: TreeBuilder,
) => {
  parse: (data: string) => ParserResult;
};
