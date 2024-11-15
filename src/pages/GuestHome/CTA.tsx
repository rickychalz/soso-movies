const CTA = () => {
  return (
    <>
<section
  className="overflow-hidden bg-[url('/madmax.jpg')] bg-fill bg-no-repeat"
>
  <div className="bg-black/50 p-8 md:p-12 lg:px-16 lg:py-24 flex flex-col items-center">
    <div className="text-center ltr:sm:text-left rtl:sm:text-right">
      <h2 className="text-2xl font-bold text-white sm:text-3xl md:text-5xl">Experience the thrill</h2>

      <p className="hidden max-w-lg text-white/90 md:mt-6 md:block md:text-lg md:leading-relaxed">
      Ready to dive into endless entertainment? Join Soso today and enjoy access to a wide range of movies, TV shows, and exclusive content—all at your fingertips. Stream anytime, anywhere, and never miss a moment. Sign up now and start watching!
      </p>

      <div className="mt-4 sm:mt-8">
        <a
          href="#"
          className="inline-block rounded bg-teal-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-teal-700 focus:outline-none focus:ring focus:ring-yellow-400"
        >
          Start Watching
        </a>
      </div>
    </div>
  </div>
</section>
    </>
  )
}

export default CTA;