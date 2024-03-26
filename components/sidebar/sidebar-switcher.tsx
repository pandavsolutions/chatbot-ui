import { ContentType } from "@/types"
import { ChatbotUIContext } from "@/context/context"
// import {
//   IconAdjustmentsHorizontal,
//   IconBolt,
//   IconBooks,
//   IconFile,
//   IconMessage,
//   IconPencil,
//   IconRobotFace,
//   IconSparkles
// } from "@tabler/icons-react"
import {
  FcComments,
  FcFaq,
  FcServices,
  FcRules,
  FcFile,
  FcFilingCabinet,
  FcAssistant,
  FcSupport,
  FcPortraitMode
} from "react-icons/fc"
// import { TbSettingsPlus } from "react-icons/tb";
import { FC, useContext } from "react"
import { TabsList } from "../ui/tabs"
import { WithTooltip } from "../ui/with-tooltip"
import { ProfileSettings } from "../utility/profile-settings"
// import { CheckoutModal } from "../stripe/CheckoutModal"
import { SidebarSwitchItem } from "./sidebar-switch-item"
import { useRouter } from "next/navigation"

export const SIDEBAR_ICON_SIZE = 28

// const url = (typeof window.location.origin) != 'undefined' ? window.location.origin : "";
const url = "http://localhost:3000"

interface SidebarSwitcherProps {
  onContentTypeChange: (contentType: ContentType) => void
}

export const SidebarSwitcher: FC<SidebarSwitcherProps> = ({
  onContentTypeChange
}) => {
  const { profile } = useContext(ChatbotUIContext)

  const router = useRouter()
  const handleCheckOut = async () => {
    router.push("/checkout")
    router.refresh()
    return
  }

  return (
    <div className="flex flex-col justify-between border-r-2 pb-5">
      <TabsList className="bg-background grid h-[440px] grid-rows-7">
        <SidebarSwitchItem
          // icon={<IconMessage size={SIDEBAR_ICON_SIZE} />}
          icon={<FcFaq size={SIDEBAR_ICON_SIZE} />}
          contentType="chats"
          onContentTypeChange={onContentTypeChange}
        />

        <SidebarSwitchItem
          // icon={<IconAdjustmentsHorizontal size={SIDEBAR_ICON_SIZE} />}
          icon={<FcServices size={SIDEBAR_ICON_SIZE} />}
          contentType="presets"
          onContentTypeChange={onContentTypeChange}
        />

        <SidebarSwitchItem
          // icon={<IconPencil size={SIDEBAR_ICON_SIZE} />}
          icon={<FcRules size={SIDEBAR_ICON_SIZE} />}
          contentType="prompts"
          onContentTypeChange={onContentTypeChange}
        />

        <SidebarSwitchItem
          // icon={<IconSparkles size={SIDEBAR_ICON_SIZE} />}
          icon={<img src={url.concat("/assets/llm-icon1.png")} />}
          contentType="models"
          onContentTypeChange={onContentTypeChange}
        />

        <SidebarSwitchItem
          icon={<FcFile size={SIDEBAR_ICON_SIZE} />}
          // icon={<IconFile size={SIDEBAR_ICON_SIZE} />}
          contentType="files"
          onContentTypeChange={onContentTypeChange}
        />

        <SidebarSwitchItem
          icon={<FcFilingCabinet size={SIDEBAR_ICON_SIZE} />}
          // icon={<IconBooks size={SIDEBAR_ICON_SIZE} />}
          contentType="collections"
          onContentTypeChange={onContentTypeChange}
        />

        <SidebarSwitchItem
          // icon={<IconRobotFace size={SIDEBAR_ICON_SIZE} />}
          icon={<FcAssistant size={SIDEBAR_ICON_SIZE} />}
          contentType="assistants"
          onContentTypeChange={onContentTypeChange}
        />

        <SidebarSwitchItem
          icon={<FcSupport size={SIDEBAR_ICON_SIZE} />}
          // icon={<IconBolt size={SIDEBAR_ICON_SIZE} />}
          contentType="tools"
          onContentTypeChange={onContentTypeChange}
        />
      </TabsList>

      <div className="flex flex-col items-center space-y-4">
        <WithTooltip
          display={<div>{profile?.credits_left}</div>}
          trigger={
            <img
              src={url.concat("/assets/cash.png")}
              width={SIDEBAR_ICON_SIZE}
              height={SIDEBAR_ICON_SIZE}
              onClick={handleCheckOut}
            />
          }
        />
        {/* TODO */}
        {/* <WithTooltip display={<div>Import</div>} trigger={<Import />} /> */}

        {/* TODO */}
        {/* <Alerts /> */}

        <WithTooltip
          display={<div>Profile Settings</div>}
          trigger={<ProfileSettings />}
          // trigger={<FcPortraitMode size={SIDEBAR_ICON_SIZE} />}
        />
      </div>
    </div>
  )
}
