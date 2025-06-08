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

      // return new Response(JSON.stringify(list), {
      //   headers: { "Content-Type": "application/json" },
      // });

      return new Response("Behold, I'm a talking potato!", {
        headers: { "Content-Type": "text/plain" },
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
