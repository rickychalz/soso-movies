const Section = () => {
  return (
    <div>


<section className="overflow-hidden bg-[#121212] sm:grid sm:grid-cols-2">
  <div className="p-8 md:p-12 lg:px-16 lg:py-24">
    <div className="mx-auto max-w-xl text-center ltr:sm:text-left rtl:sm:text-right">
      <h2 className="text-2xl font-bold text-teal-600 md:text-3xl">
        Get access to thousand of movies and tv shows all at the comfort of your couch.
      </h2>

      <p className="hidden text-gray-500 md:mt-4 md:block">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Et, egestas tempus tellus etiam
        sed. Quam a scelerisque amet ullamcorper eu enim et fermentum, augue. Aliquet amet volutpat
        quisque ut interdum tincidunt duis.
      </p>

      <div className="mt-4 md:mt-8">
        <a
          href="#"
          className="inline-block rounded bg-teal-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-teal-700 focus:outline-none focus:ring focus:ring-yellow-400"
        >
          Start watching
        </a>
      </div>
    </div>
  </div>

  <img
    alt=""
    src="/intersellar.jpg"
    className="h-56 w-full object-cover sm:h-full"
  />
</section>
    </div>
  )
}

export default Section