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
    let tokens = grammar.tokenizeLine("#comment").tokens;
    expect(tokens[0]).toEqual({value: "#comment", scopes:[root, "comment.line.number-sign.ck2"]});
  });

  it("tokenizes the always keyword", () => {
    let tokens = grammar.tokenizeLine("always").tokens;
    expect(tokens[0]).toEqual({value: "always", scopes: [root, "constant.language.bool.true.always.ck2"]});
  });

});
