import { Document, Font, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { CvParsed } from "@/types";

Font.register({
  family: "Lora",
  fonts: [
    { src: "https://fonts.gstatic.com/s/lora/v37/0QI6MX1D_JOuGQbT0gvTJPa787weuyJG.ttf" },
    { src: "https://fonts.gstatic.com/s/lora/v37/0QI6MX1D_JOuGQbT0gvTJPa787z5vCJG.ttf", fontWeight: "bold" },
    { src: "https://fonts.gstatic.com/s/lora/v37/0QI8MX1D_JOuMw_hLdO6T2wV9KnW-MoFkqg.ttf", fontStyle: "italic" },
  ],
});

const COLOR = {
  dark: "#1e293b",
  text: "#334155",
  muted: "#64748b",
  accent: "#2563eb",
  accentLight: "#dbeafe",
  divider: "#cbd5e1",
};

const s = StyleSheet.create({
  page: {
    fontFamily: "Lora",
    fontSize: 10,
    color: COLOR.text,
    paddingTop: 36,
    paddingBottom: 36,
    paddingHorizontal: 50,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLOR.dark,
    textAlign: "center",
    letterSpacing: 3,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  email: {
    fontSize: 9,
    color: COLOR.accent,
    textAlign: "center",
    marginBottom: 10,
  },
  accentLine: {
    height: 2,
    backgroundColor: COLOR.accent,
    marginBottom: 16,
  },
  sectionHeading: {
    fontSize: 9,
    fontWeight: "bold",
    color: COLOR.accent,
    letterSpacing: 2,
    textTransform: "uppercase",
    backgroundColor: COLOR.accentLight,
    borderLeftWidth: 3,
    borderLeftColor: COLOR.accent,
    paddingVertical: 4,
    paddingLeft: 8,
    marginTop: 14,
    marginBottom: 8,
  },
  summary: {
    fontSize: 10,
    color: COLOR.muted,
    fontStyle: "italic",
    lineHeight: 1.5,
    marginBottom: 4,
  },
  skill: {
    fontSize: 10,
    color: COLOR.dark,
    fontWeight: "bold",
    lineHeight: 1.5,
    marginBottom: 4,
  },
  expEntry: {
    marginBottom: 8,
    minPresenceAhead: 40,
  },
  expDivider: {
    height: 1,
    backgroundColor: COLOR.divider,
    marginVertical: 8,
    opacity: 0.5,
  },
  expTitleRow: {
    flexDirection: "row",
    marginBottom: 1,
  },
  expTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: COLOR.dark,
  },
  expCompany: {
    fontSize: 10,
    color: COLOR.accent,
  },
  expDates: {
    fontSize: 8,
    color: COLOR.muted,
    fontStyle: "italic",
    marginBottom: 4,
  },
  bulletRow: {
    flexDirection: "row",
    marginBottom: 3,
    paddingLeft: 8,
  },
  bulletDot: {
    fontSize: 10,
    color: COLOR.accent,
    marginRight: 6,
    width: 8,
  },
  bulletText: {
    fontSize: 10,
    color: COLOR.text,
    lineHeight: 1.5,
    flex: 1,
  },
  eduEntry: {
    marginBottom: 3,
  },
  eduDegree: {
    fontSize: 10,
    fontWeight: "bold",
    color: COLOR.dark,
  },
  eduSchool: {
    fontSize: 10,
    color: COLOR.muted,
  },
});

interface Props {
  cvParsed: CvParsed;
  experienceEntries: { exp: CvParsed["experience"][number]; bullets: string[] }[];
}

export function CvDocument({ cvParsed, experienceEntries }: Props) {
  return (
    <Document>
      <Page size="A4" style={s.page}>
        <Text style={s.name}>{cvParsed.name}</Text>
        <Text style={s.email}>{cvParsed.email}</Text>
        <View style={s.accentLine} />

        <Text style={s.sectionHeading}>Professional Summary</Text>
        <Text style={s.summary}>{cvParsed.summary}</Text>

        <Text style={s.sectionHeading}>Skills</Text>
        <Text style={s.skill}>{cvParsed.skills.join(", ")}</Text>

        <Text style={s.sectionHeading}>Experience</Text>
        {experienceEntries.map(({ exp, bullets }, i) => (
          <View key={i} style={s.expEntry}>
            {i > 0 && <View style={s.expDivider} />}
            <View style={s.expTitleRow}>
              <Text style={s.expTitle}>{exp.title}</Text>
              <Text style={s.expCompany}> {" — "} {exp.company}</Text>
            </View>
            <Text style={s.expDates}>{exp.dates}</Text>
            {bullets.map((bullet, j) => (
              <View key={j} style={s.bulletRow} wrap={false}>
                <Text style={s.bulletDot}>-</Text>
                <Text style={s.bulletText}>{bullet}</Text>
              </View>
            ))}
          </View>
        ))}

        <Text style={s.sectionHeading}>Education</Text>
        {cvParsed.education.map((edu, i) => (
          <View key={i} style={s.eduEntry}>
            <View style={s.expTitleRow}>
              <Text style={s.eduDegree}>{edu.degree}</Text>
              <Text style={s.eduSchool}>{" "}— {edu.school}</Text>
            </View>
            <Text style={s.expDates}>{edu.year}</Text>
          </View>
        ))}
      </Page>
    </Document>
  );
}
