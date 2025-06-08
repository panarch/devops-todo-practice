export default {
  async fetch(request, env, _ctx) {
    const url = new URL(request.url);

    if (url.pathname === "/add") {
      const content = url.searchParams.get("content");
      if (!content) {
        return new Response("Missing content", { status: 400 });
      }

      const rawList = await env.TODOS.get("list");
      const list = rawList ? JSON.parse(rawList) : [];

      list.push({ id: crypto.randomUUID(), content });
      await env.TODOS.put("list", JSON.stringify(list));

      return new Response(JSON.stringify(list), {
        headers: { "Content-Type": "application/json" },
      });
    }

    if (url.pathname === "/list") {
      const rawList = await env.TODOS.get("list");
      const list = rawList ? JSON.parse(rawList) : [];

      return new Response(JSON.stringify(list), {
        headers: { "Content-Type": "application/json" },
      });
    }

    if (url.pathname === "/delete") {
      const id = url.searchParams.get("id");
      if (!id) {
        return new Response("Missing id", { status: 400 });
      }

      const rawList = await env.TODOS.get("list");
      const list = rawList ? JSON.parse(rawList) : [];

      const index = list.findIndex((item) => item.id === id);
      if (index === -1) {
        return new Response("Not found", { status: 404 });
      }

      list.splice(index, 1);
      await env.TODOS.put("list", JSON.stringify(list));

      return new Response(JSON.stringify(list), {
        headers: { "Content-Type": "application/json" },
      });
    }

    if (url.pathname === "/migrate") {
      const rawList = await env.TODOS.get("list");
      const list = rawList ? JSON.parse(rawList) : [];

      let changed = false;
      for (const item of list) {
        if (!("id" in item)) {
          item.id = crypto.randomUUID();
          changed = true;
        }
      }

      if (changed) {
        await env.TODOS.put("list", JSON.stringify(list));
      }

      return new Response(JSON.stringify(list), {
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response("Hello World!");
  },
};
