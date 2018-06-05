describe("CK2 grammar", function() {
  var grammar = null;
  var root = "source.ck2"; // defined here to allow painless changes (and reduce typing)

  beforeEach(() => {
    waitsForPromise(() => {
      return atom.packages.activatePackage("language-crusader-kings--i-i");
    });

    runs(() => {
      grammar = atom.grammars.grammarForScopeName(root);
    });
  });

  it("parses the grammar", () => {
    expect(grammar).toBeTruthy();
    expect(grammar.scopeName).toBe(root);
  });

  it("is configured correctly", () => {
    expect(grammar.maxLineLength).toBe(Infinity);
  });

  it("tokenizes spaces", () => {
    let tokens = grammar.tokenizeLine(" ").tokens;
    expect(tokens[0]).toEqual({value: " ", scopes:[root]});
  });

  it("tokenizes comments", () => {
    let tokens = grammar.tokenizeLine("# comment").tokens;
    expect(tokens[0]).toEqual({value: "#", scopes:[root, "comment.line.number-sign.ck2", "meta.comment.line.number-sign.ck2", "punctuation.definition.comment.number-sign.ck2"]});
  });

  it("tokenizes validator commands in comments", () => {
    let tokens = grammar.tokenizeLine("# Audax Validator EnableCommentMetadata").tokens;
    expect(tokens[0]).toEqual({value: "#", scopes:[root, "comment.line.number-sign.ck2", "meta.comment.line.number-sign.ck2", "keyword.control.directive.validator.number-sign.ck2"]});
    expect(tokens[1]).toEqual({value: " ", scopes:[root, "comment.line.number-sign.ck2", "meta.comment.line.number-sign.ck2"]});
    expect(tokens[2]).toEqual({value: "Audax Validator", scopes:[root, "comment.line.number-sign.ck2", "meta.comment.line.number-sign.ck2", "keyword.control.directive.validator.ck2"]});
    expect(tokens[3]).toEqual({value: " ", scopes:[root, "comment.line.number-sign.ck2", "meta.comment.line.number-sign.ck2"]});
    expect(tokens[4]).toEqual({value: "EnableCommentMetadata", scopes:[root, "comment.line.number-sign.ck2", "meta.comment.line.number-sign.ck2", "variable.parameter.validator.metaData.ck2"]});
  });

  it("tokenizes codetags in comments", () => {
    let tokens = grammar.tokenizeLine("# TODO").tokens;
    expect(tokens[0]).toEqual({value: "#", scopes:[root, "comment.line.number-sign.ck2", "meta.comment.line.number-sign.ck2", "punctuation.definition.comment.number-sign.ck2"]});
    expect(tokens[1]).toEqual({value: " ", scopes:[root, 'comment.line.number-sign.ck2', "meta.comment.line.number-sign.ck2"]});
    expect(tokens[2]).toEqual({value: "TODO", scopes:[root, "comment.line.number-sign.ck2", "meta.comment.line.number-sign.ck2", "storage.type.class.codetag", "entity.name.codetag.TODO", "entity.type.codetag.todo"]});
  });

  it("tokenizes codetag synonyms in comments", () => {
    let tokens = grammar.tokenizeLine("# DONE").tokens;
    expect(tokens[0]).toEqual({value: "#", scopes:[root, "comment.line.number-sign.ck2", "meta.comment.line.number-sign.ck2", "punctuation.definition.comment.number-sign.ck2"]});
    expect(tokens[1]).toEqual({value: " ", scopes:[root, 'comment.line.number-sign.ck2', "meta.comment.line.number-sign.ck2"]});
    expect(tokens[2]).toEqual({value: "DONE", scopes:[root, "comment.line.number-sign.ck2", "meta.comment.line.number-sign.ck2", "storage.type.class.codetag", "entity.name.codetag.DONE", "entity.type.codetag.todo"]});
  });

  it("tokenizes double quoted strings", () => {
    let tokens = grammar.tokenizeLine('"x"').tokens;
    expect(tokens[0]).toEqual({value: '"', scopes:[root, "string.quoted.double.ck2", "punctuation.definition.string.begin.double.quote.ck2"]});
    expect(tokens[1]).toEqual({value: "x", scopes:[root, "string.quoted.double.ck2"]});
    expect(tokens[2]).toEqual({value: '"', scopes:[root, "string.quoted.double.ck2", "punctuation.definition.string.end.double.quote.ck2"]});
  });

  it("tokenizes escape characters in strings", () => {
    let tokens = grammar.tokenizeLine('"\\x"').tokens;
    expect(tokens[0]).toEqual({value: '"', scopes:[root, "string.quoted.double.ck2", "punctuation.definition.string.begin.double.quote.ck2"]});
    expect(tokens[1]).toEqual({value: "\\", scopes:[root, "string.quoted.double.ck2", "constant.character.escape.ck2", "punctuation.definition.escape.slash.back.ck2"]});
    expect(tokens[2]).toEqual({value: "x", scopes:[root, "string.quoted.double.ck2", "constant.character.escape.ck2"]});
    expect(tokens[3]).toEqual({value: '"', scopes:[root, "string.quoted.double.ck2", "punctuation.definition.string.end.double.quote.ck2"]});
  });

  it("tokenizes single quoted strings", () => {
    let tokens = grammar.tokenizeLine("'x'").tokens;
    expect(tokens[0]).toEqual({value: "'", scopes:[root, "string.quoted.single.ck2", "punctuation.definition.string.begin.single.quote.ck2"]});
    expect(tokens[1]).toEqual({value: "x", scopes:[root, "string.quoted.single.ck2"]});
    expect(tokens[2]).toEqual({value: "'", scopes:[root, "string.quoted.single.ck2", "punctuation.definition.string.end.single.quote.ck2"]});
  });

  it("tokenizes localisation keys", () => {
    let tokens = grammar.tokenizeLine("[x]").tokens;
    expect(tokens[0]).toEqual({value: "[", scopes:[root, "punctuation.definition.loc_key.begin.bracket.square.ck2"]});
    expect(tokens[1]).toEqual({value: "x", scopes:[root, "string.interpolated.loc_key.ck2", "entity.name.tag.loc_key.ck2"]});
    expect(tokens[2]).toEqual({value: "]", scopes:[root, "punctuation.definition.loc_key.end.bracket.square.ck2"]});
  });

  it("tokenizes localisation keys inside strings", () => {
    let tokens = grammar.tokenizeLine("'[x]'").tokens;
    expect(tokens[0]).toEqual({value: "'", scopes:[root, "string.quoted.single.ck2", "punctuation.definition.string.begin.single.quote.ck2"]});
    expect(tokens[1]).toEqual({value: "[", scopes:[root, "string.quoted.single.ck2", "punctuation.definition.loc_key.begin.bracket.square.ck2"]});
    expect(tokens[2]).toEqual({value: "x", scopes:[root, "string.quoted.single.ck2", "string.interpolated.loc_key.ck2", "entity.name.tag.loc_key.ck2"]});
    expect(tokens[3]).toEqual({value: "]", scopes:[root, "string.quoted.single.ck2", "punctuation.definition.loc_key.end.bracket.square.ck2"]});
    expect(tokens[4]).toEqual({value: "'", scopes:[root, "string.quoted.single.ck2", "punctuation.definition.string.end.single.quote.ck2"]});
  });

  it("tokenizes the always keyword", () => {
    let tokens = grammar.tokenizeLine("always").tokens;
    expect(tokens[0]).toEqual({value: "always", scopes: [root, "constant.language.bool.true.always.ck2"]});
  });

  it("tokenizes nested scopes", () => {
    let tokenLines = grammar.tokenizeLines("character_event={\ntrigger={\nfather={\nis_alive=yes\n}\n}\n}");
    expect(tokenLines[0][0]).toEqual({value: "character", scopes:[root, "keyword.control.event.definition.ck2", "entity.type.event.character.ck2"]});
    expect(tokenLines[0][1]).toEqual({value: "_event", scopes:[root, "keyword.control.event.definition.ck2"]});
    expect(tokenLines[0][2]).toEqual({value: "=", scopes:[root, "punctuation.definition.event.assignment.ck2"]});
    expect(tokenLines[0][3]).toEqual({value: "{", scopes:[root, "punctuation.definition.event.begin.bracket.curly.ck2"]});
    expect(tokenLines[1][0]).toEqual({value: "trigger", scopes:[root, "meta.event.block.ck2", "entity.type.trigger.ck2", "keyword.control.trigger.ck2"]});
    expect(tokenLines[1][1]).toEqual({value: "=", scopes:[root, "meta.event.block.ck2", "entity.type.trigger.ck2", "punctuation.definition.trigger.assignment.equals.ck2"]});
    expect(tokenLines[1][2]).toEqual({value: "{", scopes:[root, "meta.event.block.ck2", "entity.type.trigger.ck2", "punctuation.definition.trigger.begin.bracket.curly.ck2"]});
    expect(tokenLines[2][0]).toEqual({value: "father", scopes:[root, "meta.event.block.ck2", "meta.trigger.block.ck2", "support.class.scope.father.ck2", "entity.type.scope.character.ck2"]});
    expect(tokenLines[2][1]).toEqual({value: "=", scopes:[root, "meta.event.block.ck2", "meta.trigger.block.ck2", "punctuation.definition.clause.assignment.equals.ck2"]});
    expect(tokenLines[2][2]).toEqual({value: "{", scopes:[root, "meta.event.block.ck2", "meta.trigger.block.ck2", "punctuation.definition.clause.begin.bracket.curly.ck2"]});
    expect(tokenLines[3][0]).toEqual({value: "is_alive", scopes:[root, "meta.event.block.ck2", "meta.trigger.block.ck2", "meta.condition.block.ck2", "variable.language.condition.health.ck2"]});
    expect(tokenLines[3][1]).toEqual({value: "=", scopes:[root, "meta.event.block.ck2", "meta.trigger.block.ck2", "meta.condition.block.ck2", "keyword.operator.assignment.equals.ck2"]});
    expect(tokenLines[3][2]).toEqual({value: "yes", scopes:[root, "meta.event.block.ck2", "meta.trigger.block.ck2", "meta.condition.block.ck2", "constant.language.bool.true.yes.ck2"]});
    expect(tokenLines[4][0]).toEqual({value: "}", scopes:[root, "meta.event.block.ck2", "meta.trigger.block.ck2", "punctuation.definition.clause.end.bracket.curly.ck2"]});
    expect(tokenLines[5][0]).toEqual({value: "}", scopes:[root, "meta.event.block.ck2", "punctuation.definition.trigger.end.bracket.curly.ck2"]});
    expect(tokenLines[6][0]).toEqual({value: "}", scopes:[root, "punctuation.definition.event.end.bracket.curly.ck2"]});

  });

});
