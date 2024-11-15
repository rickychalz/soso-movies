const Stats = () => {
  return (
    <div className="bg-[#121212]">
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-0">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-teal-500 sm:text-4xl">
            Trusted and loved by users worldwide
          </h2>

          <p className="mt-4 text-gray-500 sm:text-xl">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione
            dolores laborum labore provident impedit esse recusandae facere
            libero harum sequi.
          </p>
        </div>

        <dl className="mg-6 grid grid-cols-1 gap-4 divide-y divide-gray-100 sm:mt-8 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
          <div className="flex flex-col px-4 py-8 text-center">
            <dt className="order-last text-lg font-medium text-gray-500">
              Movies & TV Shows
            </dt>

            <dd className="text-4xl font-extrabold text-teal-600 md:text-5xl">
              10,0000+
            </dd>
          </div>

          <div className="flex flex-col px-4 py-8 text-center">
            <dt className="order-last text-lg font-medium text-gray-500">
              Countries available
            </dt>

            <dd className="text-4xl font-extrabold text-teal-600 md:text-5xl">
              150+
            </dd>
          </div>

          <div className="flex flex-col px-4 py-8 text-center">
            <dt className="order-last text-lg font-medium text-gray-500">
            Rated 4.8/5 by users
            </dt>
                
            <dd className="text-4xl font-extrabold text-teal-600 md:text-5xl">
              1M  
            </dd>
          </div>

          <div className="flex flex-col px-4 py-8 text-center">
            <dt className="order-last text-lg font-medium text-gray-500">
              Always watch in high quality
            </dt>

            <dd className="text-4xl font-extrabold text-teal-600 md:text-5xl">
              4K UHD
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default Stats;
