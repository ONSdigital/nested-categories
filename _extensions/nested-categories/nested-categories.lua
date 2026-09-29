function Pandoc(doc)
  if quarto.doc.is_format("html") then
    quarto.doc.add_html_dependency({
      name = "nested-categories",
      version = "1.0.0",
      scripts = { { path = "nested-categories.js", afterBody = true } },
      stylesheets = { "nested-categories.css" }
    })
  end
  return doc
end
