"use client";

import { NdaFormData, PartyInfo } from "@/lib/types";

interface NdaFormProps {
  data: NdaFormData;
  onChange: (data: NdaFormData) => void;
}

const inputClass =
  "w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";
const labelClass = "block text-sm font-medium text-gray-700 mb-1";
const sectionClass = "space-y-3";

function PartyFields({
  label,
  party,
  onChange,
}: {
  label: string;
  party: PartyInfo;
  onChange: (party: PartyInfo) => void;
}) {
  return (
    <fieldset className={sectionClass}>
      <legend className="text-sm font-semibold text-gray-900">{label}</legend>
      <div>
        <label className={labelClass}>Full Name</label>
        <input
          type="text"
          className={inputClass}
          value={party.name}
          onChange={(e) => onChange({ ...party, name: e.target.value })}
          placeholder="Jane Smith"
        />
      </div>
      <div>
        <label className={labelClass}>Title</label>
        <input
          type="text"
          className={inputClass}
          value={party.title}
          onChange={(e) => onChange({ ...party, title: e.target.value })}
          placeholder="CEO"
        />
      </div>
      <div>
        <label className={labelClass}>Company</label>
        <input
          type="text"
          className={inputClass}
          value={party.company}
          onChange={(e) => onChange({ ...party, company: e.target.value })}
          placeholder="Acme Inc."
        />
      </div>
      <div>
        <label className={labelClass}>Notice Address</label>
        <input
          type="text"
          className={inputClass}
          value={party.noticeAddress}
          onChange={(e) =>
            onChange({ ...party, noticeAddress: e.target.value })
          }
          placeholder="jane@acme.com"
        />
      </div>
    </fieldset>
  );
}

export default function NdaForm({ data, onChange }: NdaFormProps) {
  const update = (partial: Partial<NdaFormData>) =>
    onChange({ ...data, ...partial });

  return (
    <form
      className="space-y-6"
      onSubmit={(e) => e.preventDefault()}
    >
      <div className={sectionClass}>
        <h3 className="text-sm font-semibold text-gray-900">Agreement Terms</h3>
        <div>
          <label className={labelClass}>Purpose</label>
          <textarea
            className={inputClass}
            rows={2}
            value={data.purpose}
            onChange={(e) => update({ purpose: e.target.value })}
          />
        </div>
        <div>
          <label className={labelClass}>Effective Date</label>
          <input
            type="date"
            className={inputClass}
            value={data.effectiveDate}
            onChange={(e) => update({ effectiveDate: e.target.value })}
          />
        </div>
      </div>

      <div className={sectionClass}>
        <h3 className="text-sm font-semibold text-gray-900">MNDA Term</h3>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="mndaTermType"
              value="expires"
              checked={data.mndaTermType === "expires"}
              onChange={() => update({ mndaTermType: "expires" })}
            />
            Expires after
          </label>
          {data.mndaTermType === "expires" && (
            <input
              type="number"
              min="1"
              className="w-20 rounded border border-gray-300 px-2 py-1 text-sm"
              value={data.mndaTermYears}
              onChange={(e) => update({ mndaTermYears: e.target.value })}
            />
          )}
          {data.mndaTermType === "expires" && (
            <span className="text-sm text-gray-600">year(s)</span>
          )}
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="radio"
            name="mndaTermType"
            value="continues"
            checked={data.mndaTermType === "continues"}
            onChange={() => update({ mndaTermType: "continues" })}
          />
          Continues until terminated
        </label>
      </div>

      <div className={sectionClass}>
        <h3 className="text-sm font-semibold text-gray-900">
          Term of Confidentiality
        </h3>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="confTermType"
              value="years"
              checked={data.confidentialityTermType === "years"}
              onChange={() => update({ confidentialityTermType: "years" })}
            />
            Expires after
          </label>
          {data.confidentialityTermType === "years" && (
            <input
              type="number"
              min="1"
              className="w-20 rounded border border-gray-300 px-2 py-1 text-sm"
              value={data.confidentialityTermYears}
              onChange={(e) =>
                update({ confidentialityTermYears: e.target.value })
              }
            />
          )}
          {data.confidentialityTermType === "years" && (
            <span className="text-sm text-gray-600">year(s)</span>
          )}
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="radio"
            name="confTermType"
            value="perpetuity"
            checked={data.confidentialityTermType === "perpetuity"}
            onChange={() => update({ confidentialityTermType: "perpetuity" })}
          />
          In perpetuity
        </label>
      </div>

      <div className={sectionClass}>
        <h3 className="text-sm font-semibold text-gray-900">
          Governing Law & Jurisdiction
        </h3>
        <div>
          <label className={labelClass}>Governing Law (State)</label>
          <input
            type="text"
            className={inputClass}
            value={data.governingLaw}
            onChange={(e) => update({ governingLaw: e.target.value })}
            placeholder="Delaware"
          />
        </div>
        <div>
          <label className={labelClass}>Jurisdiction</label>
          <input
            type="text"
            className={inputClass}
            value={data.jurisdiction}
            onChange={(e) => update({ jurisdiction: e.target.value })}
            placeholder="courts located in New Castle, DE"
          />
        </div>
      </div>

      <div className={sectionClass}>
        <h3 className="text-sm font-semibold text-gray-900">Modifications</h3>
        <textarea
          className={inputClass}
          rows={3}
          value={data.modifications}
          onChange={(e) => update({ modifications: e.target.value })}
          placeholder="List any modifications to the MNDA (optional)"
        />
      </div>

      <PartyFields
        label="Party 1"
        party={data.party1}
        onChange={(party1) => update({ party1 })}
      />

      <PartyFields
        label="Party 2"
        party={data.party2}
        onChange={(party2) => update({ party2 })}
      />
    </form>
  );
}
