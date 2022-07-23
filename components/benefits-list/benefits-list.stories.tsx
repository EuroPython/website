import type { ComponentMeta, ComponentStoryObj } from "@storybook/react";
import { BenefitItem } from "./benefit-item";

import { BenefitsList } from "./benefits-list";

type Story = ComponentStoryObj<typeof BenefitsList>;

const meta: ComponentMeta<typeof BenefitsList> = {
  component: () => (
    <BenefitsList>
      <BenefitItem icon="network" title="Socialise">
        Make contact with a vibrant network of innovators
      </BenefitItem>
      <BenefitItem icon="target" title="Target">
        Run a targeted marketing by reaching out directly to people interested
        in a topic
      </BenefitItem>
      <BenefitItem icon="award" title="Community Cultivation">
        Let the world know your company support the Python open source community
      </BenefitItem>
      <BenefitItem icon="transfer" title="Know-How Transfer">
        Educate your staff and benefit from the knowledge of the community
      </BenefitItem>
      <BenefitItem icon="headhunt" title="Head Hunting">
        Take advantage of the conference for recruitment
      </BenefitItem>
      <BenefitItem icon="rocket" title="New Business">
        Use the conference to attract new projects
      </BenefitItem>
    </BenefitsList>
  ),
};
export const BenefitsListExample: Story = {};
export default meta;
