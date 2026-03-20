import JobListingItems from "./_shared/JobListingItems"

const HomePage = ({ searchParams} : {searchParams: Promise<Record<string, string | string[]>>}) => {
  return (
    <div className="p-4">
      <JobListingItems searchParams={searchParams} />
    </div>
  )
}

export default HomePage