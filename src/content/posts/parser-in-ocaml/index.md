---
title: "Write a Parser in OCaml"
date: 2017-06-25
stage: 1
prerequisites: []
concepts: [definition, syntax-definition, sematics-definition, implementation, translate-language-definition-to-code]
tags: []
summary: "First we define the language, then translate it into OCaml code."
---

First we define the language, then translate it into OCaml code.



## Definition

Two part is necessary,
1. Syntax Definition in Bacus-Naur Form to define the "Language"(which is, set of string).
2. And sematics definition to Describe the "Meaning".


## Syntax Definition
Including lexing and parsing rules.

```
<start> ::= <exp> '\n'
<exp>   ::= <exp> <op> <exp> | ["0"-"9"]+
<op>    ::= "+" | "-" 
```

## Sematics Definition

This is the AST(Abstract Syntax Tree) definition, sine we want to write a frontend for a compiler.

``` ocaml
type op  = Plus | Minus 
type exp = Exp of exp * op * exp | Num of int 
```

## Implementation

We need to implement four parts

| part   | file       | method                                |
|--------|------------|---------------------------------------|
| lexer  | lexer.mll  | ocamllex                              |
| parser | parser.mly | ocamlyacc                             |
| AST    | ast.ml     | by hand, some lib for pretty printing |
| driver | driver.ml  | by hand                               |

## Translate language definition to code

In our Bacus-Naur Form definition, those symbols quoted with `'` `"` should be denoted as Lexeme simble. and defined in the `parser.mly` file.

```
<start> ::= <exp> '\n'
<exp>   ::= <exp> <op> <exp> | ['0'-'9']+
<op>    ::= "+" | "-" 
```
$\Downarrow$
```
// regular grammar
<EOL>   ::=  '\n'
<NUM>   ::= ['0'-'9']+
<PLUS>  ::= "+"
<MINUS> ::= "-"
// context free grammar
<start> ::= <exp> <EOL>
<exp>   ::= <exp> <op> <exp> | <NUM>
<op>    ::= <PLUS> | <MINUS>
```

Regular grammar tokens are defined in the header of `parser.mly`, like this
``` 
%token <int> NUM
%token PLUS MINUS
%token EOL
%left  PLUS MINUS
```
and produced by `lexer.mll`, like this
``` 
rule token = parse
    [' ' '\t']      { token lexbuf }
  | '\n'            { Parser.EOL}
  | ['0'-'9']+ as i { Parser.NUM(int_of_string i) }
  | '+'             { Parser.PLUS }
  | '-'             { Parser.MINUS }
  | eof             { raise Eof }
```

Context free grammar are put in the main part of the `parser.mly`

The AST part can be put in the `ast.ml` file directly.  Some utility function for error handling and pretty printing can be put here.
