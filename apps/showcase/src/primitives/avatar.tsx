import { AvatarFallback, AvatarImage, AvatarRoot } from "@red-elements/avatar";

export function Avatar() {
  return (
    <div className="max-w-md mx-auto">
      <AvatarRoot>
        <AvatarImage src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png" />
        <AvatarFallback>CD</AvatarFallback>
      </AvatarRoot>
    </div>
  );
}
