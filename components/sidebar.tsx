import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";
import { Input } from "./ui/input";
import useSearchStore from "../app/stores/store";
import { Button } from "./ui/button";

const SideBar = () => {
  const updateCaseLabel = useSearchStore((state) => state.updateCaseLabel);

  return (
    <div className=" w-1/4 bg-[#1e1e1e] text-[#e5e4e7]">
      <h1 className="text-4xl font-extrabold tracking-tight text-center m-4 ">
        Stock Visualiser
      </h1>
      <div className="flex flex-col space-y-2 items-center">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="font-semibold leading-none tracking-tight text-sm">
              Search by Case Label
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Enter a <span className="font-bold">case label</span> below to
              view a history of its movements
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center">
            <div className="flex w-full items-center space-x-2">
              <div className="flex items-center w-full">
                <FontAwesomeIcon className="absolute pl-2" icon={faSearch} />
                <Input
                  type="text"
                  placeholder="Enter case label..."
                  onChange={(e) => updateCaseLabel(e.target.value)}
                  className="h-8 text-xs pl-7"
                />
              </div>
              <Button className="text-xs" type="submit">
                Find
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SideBar;
