import {
  Dropdown,
  DropdownButton,
  DropdownDivider,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
} from '@/components/catalyst/dropdown'
import { Navbar, NavbarDivider, NavbarItem, NavbarSection, NavbarSpacer } from '@/components/catalyst/navbar'
import {
  BarsArrowDownIcon,
  Cog8ToothIcon,
} from '@heroicons/react/16/solid'
import {  HomeIcon } from '@heroicons/react/20/solid'
import { useNavigate } from 'react-router-dom';


export default function AppNavbar() {
const navigate = useNavigate();

  return (
    <Navbar>
      <Dropdown>
        <DropdownButton as={NavbarItem}>
          <BarsArrowDownIcon />
        </DropdownButton>
        <DropdownMenu className="min-w-64" anchor="bottom start">
          <DropdownItem onClick={() => navigate('/settings')}> 
              <Cog8ToothIcon />
                <DropdownLabel>Settings</DropdownLabel>
          </DropdownItem>
          <DropdownDivider />
          <DropdownItem href="/teams/1">
            <HomeIcon />
            <DropdownLabel>Tailwind Labs</DropdownLabel>
          </DropdownItem>
          <DropdownItem href="/teams/2">
            {/* <Avatar slot="icon" initials="WC" className="bg-purple-500 text-white" /> */}
            <DropdownLabel>Workcation</DropdownLabel>
          </DropdownItem>
          <DropdownDivider />
        </DropdownMenu>
      </Dropdown>
      <NavbarDivider className="max-lg:hidden" />
      <NavbarSpacer />
      <NavbarSection>
      </NavbarSection>
    </Navbar>
  )
}