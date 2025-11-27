export default function AdSection() {
  return (
    <section className="mb-12">
      <div className="flex flex-col items-center justify-center gap-6">
        {/* First Ad */}
        <div className="flex justify-center">
          <script type="text/javascript">
            {`
              atOptions = {
                'key' : 'baf333c025010820ccafb97978a627a3',
                'format' : 'iframe',
                'height' : 90,
                'width' : 728,
                'params' : {}
              };
            `}
          </script>
          <script type="text/javascript" src="//www.highperformanceformat.com/baf333c025010820ccafb97978a627a3/invoke.js"></script>
        </div>

        {/* Second Ad */}
        <div className="flex justify-center">
          <script type="text/javascript">
            {`
              atOptions = {
                'key' : '5a89f4563ede24d6c7e045c77d636bd8',
                'format' : 'iframe',
                'height' : 90,
                'width' : 728,
                'params' : {}
              };
            `}
          </script>
          <script type="text/javascript" src="//www.highperformanceformat.com/5a89f4563ede24d6c7e045c77d636bd8/invoke.js"></script>
        </div>

        {/* Third Ad */}
        <div className="flex justify-center">
          <script type="text/javascript">
            {`
              atOptions = {
                'key' : '2f2006adf30eef02335bb7e71bd07a9d',
                'format' : 'iframe',
                'height' : 90,
                'width' : 728,
                'params' : {}
              };
            `}
          </script>
          <script type="text/javascript" src="//www.highperformanceformat.com/2f2006adf30eef02335bb7e71bd07a9d/invoke.js"></script>
        </div>
      </div>
    </section>
  );
}
