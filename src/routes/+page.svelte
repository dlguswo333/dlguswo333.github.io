<script>
    import '../app.css';
    let count = 0;
</script>
<h1 class="text-xl hover:text-blue-300">Welcome to dlguswo333's Blog</h1>
<button class="border border-black p-1 hover:bg-slate-300"
    on:click={() => ++count}>
    {count}
</button>
