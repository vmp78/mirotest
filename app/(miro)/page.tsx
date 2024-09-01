"use client";

import { useOrganization } from "@clerk/nextjs";
import { EmptyOrg } from "./_components/emptyOrg";
import { MiroList } from "./_components/MiroList";

interface MiroPageProps{
  searchParams:{
    search?: string;
    favorites?: string;
  };
};

const HomePage=({
  searchParams,
}:MiroPageProps) => {
  const {organization}= useOrganization();

  return (
    <div className="flex-1 h-[calc(100%-80px)] p-6">
      {!organization ? (
        <EmptyOrg/>
      ): (
        <MiroList
        orgId={organization.id}
        query={searchParams}
        />
      )}
    </div>
  );
}

export default HomePage;